using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddIdeaApprovalStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApprovalStatus",
                table: "Ideas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReviewedById",
                table: "Ideas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedAt",
                table: "Ideas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Ideas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Ideas_ReviewedById",
                table: "Ideas",
                column: "ReviewedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Ideas_Users_ReviewedById",
                table: "Ideas",
                column: "ReviewedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ideas_Users_ReviewedById",
                table: "Ideas");

            migrationBuilder.DropIndex(
                name: "IX_Ideas_ReviewedById",
                table: "Ideas");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Ideas");

            migrationBuilder.DropColumn(
                name: "ReviewedById",
                table: "Ideas");

            migrationBuilder.DropColumn(
                name: "ReviewedAt",
                table: "Ideas");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Ideas");
        }
    }
}
